const midtransClient = require('midtrans-client');
const { Order, OrderStatusHistory } = require('../models');
const sequelize = require('../config/database');

// Helper to get Midtrans Snap client
const getSnapClient = () => {
  const sKey = process.env.MIDTRANS_SERVER_KEY || "";
  const cKey = process.env.MIDTRANS_CLIENT_KEY || "";
  
  if (!sKey || !cKey) {
    console.error('CRITICAL: Midtrans API Keys are missing in .env file!');
  }
  
  return new midtransClient.Snap({
    isProduction: false,
    serverKey: sKey.trim(),
    clientKey: cKey.trim()
  });
};

const toTitleCase = (value = '') =>
  value.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

const resolvePaymentMethodLabel = (statusResponse) => {
  const paymentType = statusResponse.payment_type;

  if (!paymentType) {
    return 'Midtrans';
  }

  if (paymentType === 'qris') {
    return 'QRIS';
  }

  if (paymentType === 'gopay') {
    return 'GoPay';
  }

  if (paymentType === 'shopeepay') {
    return 'ShopeePay';
  }

  if (paymentType === 'bank_transfer') {
    const vaBank =
      statusResponse.va_numbers?.[0]?.bank ||
      (statusResponse.permata_va_number ? 'permata' : '');

    return vaBank
      ? `${toTitleCase(vaBank)} Virtual Account`
      : 'Bank Transfer';
  }

  if (paymentType === 'echannel') {
    return 'Mandiri Bill Payment';
  }

  if (paymentType === 'cstore') {
    return statusResponse.store ? toTitleCase(statusResponse.store) : 'Convenience Store';
  }

  return toTitleCase(paymentType);
};

const recordOrderHistory = async ({
  order_id,
  event_type,
  field_name = null,
  from_value = null,
  to_value = null,
  source = 'system',
  created_by_user_id = null,
  transaction = null
}) => {
  return OrderStatusHistory.create({
    order_id,
    event_type,
    field_name,
    from_value: from_value === undefined ? null : from_value,
    to_value: to_value === undefined ? null : to_value,
    source,
    created_by_user_id,
    created_at: new Date()
  }, transaction ? { transaction } : undefined);
};

const createTransaction = async (req, res) => {
  try {
    console.log('--- START createTransaction ---');
    console.log('Request body:', req.body);
    
    const { orderId } = req.body;
    const snap = getSnapClient();

    console.log('Finding order with id:', orderId);
    const order = await Order.findByPk(orderId, {
      include: ['items']
    });

    console.log('Found order:', order);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const itemDetails = order.items.map(item => ({
      id: String(item.product_id),
      price: Math.round(item.price),
      quantity: item.quantity,
      name: item.product_name
    }));

    if (Number(order.shipping_cost) > 0) {
      itemDetails.push({
        id: 'SHIPPING',
        price: Math.round(Number(order.shipping_cost)),
        quantity: 1,
        name: 'Shipping Cost'
      });
    }

    if (Number(order.tax) > 0) {
      itemDetails.push({
        id: 'TAX',
        price: Math.round(Number(order.tax)),
        quantity: 1,
        name: 'Tax'
      });
    }

    if (Number(order.discount) > 0) {
      itemDetails.push({
        id: 'DISCOUNT',
        price: -Math.round(Number(order.discount)),
        quantity: 1,
        name: 'Discount'
      });
    }

    let parameter = {
      transaction_details: {
        order_id: `${order.order_number}-${Date.now()}`,
        gross_amount: Math.round(order.total)
      },
      customer_details: {
        first_name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone,
        shipping_address: {
          address: order.shipping_address,
          city: order.shipping_city,
          postal_code: order.shipping_zip
        }
      },
      item_details: itemDetails,
      callbacks: {
        finish: "http://localhost:5173/ecommerce/orders",
        unfinish: "http://localhost:5173/ecommerce/orders",
        error: "http://localhost:5173/ecommerce/orders"
      }
    };

    console.log('Sending Snap Request to Midtrans:', JSON.stringify(parameter, null, 2));
    const transaction = await snap.createTransaction(parameter);
    
    console.log('Midtrans Snap Response:', JSON.stringify(transaction, null, 2));
    console.log('Midtrans Snap token:', transaction.token);

    res.json({
      success: true,
      data: transaction
    });

  } catch (error) {
    console.error('--- Midtrans Error ---');
    console.error('Error message:', error.message);
    if (error.httpStatusCode) console.error('HTTP Status Code:', error.httpStatusCode);
    if (error.ApiResponse) console.error('API Response:', error.ApiResponse);
    console.error(error.stack);
    
    res.status(500).json({
      success: false,
      message: error.message,
      details: error.ApiResponse || null
    });
  }
};

const handleNotification = async (req, res) => {
  try {
    console.log('=== MIDTRANS NOTIFICATION RECEIVED ===');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    
    const snap = getSnapClient();
    const statusResponse = await snap.transaction.notification(req.body);
    console.log('Status Response from Midtrans:', JSON.stringify(statusResponse, null, 2));
    
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const paymentMethodLabel = resolvePaymentMethodLabel(statusResponse);

    console.log(`Order ID: ${orderId}`);
    console.log(`Transaction Status: ${transactionStatus}`);
    console.log(`Fraud Status: ${fraudStatus}`);
    console.log(`Payment Method Label: ${paymentMethodLabel}`);
    
    const originalOrderNumber = orderId.split('-').slice(0, -1).join('-');
    console.log(`Looking for order with order_number: ${originalOrderNumber}`);

    const order = await Order.findOne({ where: { order_number: originalOrderNumber } });
    console.log('Found Order:', order ? JSON.stringify(order.toJSON(), null, 2) : 'NOT FOUND');

    if (!order) {
      console.error('Order not found in database!');
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const previousOrderStatus = order.order_status;
    const previousPaymentStatus = order.payment_status;
    const previousPaymentMethod = order.payment_method;

    console.log('Updating order status...');
    const updateData = {};
    if (transactionStatus == 'capture') {
      if (fraudStatus == 'challenge') {
        console.log('Transaction challenged');
      } else if (fraudStatus == 'accept') {
        console.log('Updating to PAID (capture/accept)');
        updateData.payment_status = 'paid';
        updateData.order_status = 'processing';
        updateData.payment_method = paymentMethodLabel;
      }
    } else if (transactionStatus == 'settlement') {
      console.log('Updating to PAID (settlement)');
      updateData.payment_status = 'paid';
      updateData.order_status = 'processing';
      updateData.payment_method = paymentMethodLabel;
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
      console.log('Updating to FAILED');
      updateData.payment_status = 'failed';
      updateData.order_status = 'cancelled';
      updateData.payment_method = paymentMethodLabel;
    } else if (transactionStatus == 'pending') {
      console.log('Updating to PENDING');
      updateData.payment_status = 'pending';
      updateData.payment_method = paymentMethodLabel;
    }

    if (Object.keys(updateData).length > 0) {
      updateData.updated_at = new Date();

      await sequelize.transaction(async (transaction) => {
        await order.update(updateData, { transaction });

        const nextOrderStatus = updateData.order_status ?? previousOrderStatus;
        const nextPaymentStatus = updateData.payment_status ?? previousPaymentStatus;
        const nextPaymentMethod = updateData.payment_method ?? previousPaymentMethod;

        if (previousPaymentStatus !== nextPaymentStatus) {
          await recordOrderHistory({
            order_id: order.id,
            event_type: 'payment_status_changed',
            field_name: 'payment_status',
            from_value: previousPaymentStatus,
            to_value: nextPaymentStatus,
            source: 'midtrans',
            created_by_user_id: null,
            transaction
          });
        }

        if (previousOrderStatus !== nextOrderStatus) {
          await recordOrderHistory({
            order_id: order.id,
            event_type: 'order_status_changed',
            field_name: 'order_status',
            from_value: previousOrderStatus,
            to_value: nextOrderStatus,
            source: 'midtrans',
            created_by_user_id: null,
            transaction
          });
        }

        if (previousPaymentMethod !== nextPaymentMethod) {
          await recordOrderHistory({
            order_id: order.id,
            event_type: 'payment_method_changed',
            field_name: 'payment_method',
            from_value: previousPaymentMethod,
            to_value: nextPaymentMethod,
            source: 'midtrans',
            created_by_user_id: null,
            transaction
          });
        }
      });
    }
    
    const updatedOrder = await Order.findByPk(order.id);
    console.log('Updated Order:', JSON.stringify(updatedOrder.toJSON(), null, 2));

    res.json({
      success: true,
      message: 'Notification handled successfully'
    });
  } catch (error) {
    console.error('=== NOTIFICATION ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createTransaction,
  handleNotification
};
