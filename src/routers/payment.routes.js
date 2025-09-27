import express from 'express';
import { admissionPaymentPage, createAdmissionPayment, verifyAdmissionPayment } from '../controllers/payment.controllers.js';

const payment_route = express();

payment_route.get('/admissionPaymentPage', admissionPaymentPage);
payment_route.post('/createAdmissionPayment', createAdmissionPayment);
payment_route.post('/verifyAdmissionPayment', verifyAdmissionPayment);

export default payment_route;