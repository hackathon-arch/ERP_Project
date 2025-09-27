import Razorpay from 'razorpay';
import { AdmissionOrder } from "../models/admissionOrder.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendStudentConfirmation = async (student) => {
    const mailOptions = {
        from: `"Admissions Team" <${process.env.EMAIL_USER}>`,
        to: student.email,
        subject: "Admission Confirmation",
        html: `
      <h2>Hi ${student.name},</h2>
      <p>Your paymet for admission to <strong>${student.collegeName}</strong> has been successfully completed.</p>
      <p>Department: ${student.departmentName}</p>
      <p>We’ll notify you once your enrollment number is generated for ERP registration.</p>
      <br><p>Regards,<br>Admissions Team</p>
    `
    };
    await transporter.sendMail(mailOptions);
};

const sendAdminNotification = async (student) => {
    const mailOptions = {
        from: `"Admissions System" <${process.env.EMAIL_USER}>`,
        to: "saikatatmoyna@gmail.com",
        subject: "New Admission - Enrollment Number Required",
        html: `
      <h3>New Admission Request</h3>
      <ul>
        <li><strong>Name:</strong> ${student.name}</li>
        <li><strong>Email:</strong> ${student.email}</li>
        <li><strong>College:</strong> ${student.collegeName}</li>
        <li><strong>Department:</strong> ${student.departmentName}</li>
        <li><strong>Address:</strong> ${student.address}</li>
      </ul>
    `
    };
    await transporter.sendMail(mailOptions);
};


const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});

export const admissionPaymentPage = async (req, res) => {
    try {
        res.render('admissionPayment');
    } catch (error) {
        console.log(error.message);
    }
};

export const createAdmissionPayment = async (req, res) => {
    try {
        const amount = req.body.amount * 100;
        const options = {
            amount,
            currency: 'INR',
            receipt: 'razorUser@gmail.com'
        };

        razorpayInstance.orders.create(options, (err, order) => {
            if (!err) {
                res.status(200).send({
                    success: true,
                    msg: 'Order Created',
                    order_id: order.id,
                    amount,
                    key_id: RAZORPAY_ID_KEY,
                    product_name: req.body.name,
                    description: req.body.description,
                    contact: '8567345632',
                    name: 'Nexus ERP',
                    email: 'saikatusesnu@gmail.com'
                });
            } else {
                res.status(400).send({ success: false, msg: 'Something went wrong!' });
            }
        });
    } catch (error) {
        console.log(error.message);
    }
};

export const verifyAdmissionPayment = async (req, res) => {
    try {
        const studentMail = req.body.email;
        if (!studentMail) {
            return res.status(400).send("Email not provided");
        }

        const studentData = await AdmissionOrder.findOne({ email: studentMail });
        if (!studentData) {
            return res.status(404).send("Student not found");
        }

        await sendStudentConfirmation(studentData);
        await sendAdminNotification(studentData);

    } catch (error) {
        console.error("Verification error:", error.message);
        res.status(500).send("Internal Server Error");
    }
};
