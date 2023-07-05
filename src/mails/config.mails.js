import nodemailer from 'nodemailer';
import smtpTransport from "nodemailer-smtp-transport";
import fs from "fs";
import Handlebars from "handlebars";
import ejs from "ejs";

const user = process.env.USER_MAIL;
const pass = process.env.PASS_MAIL;
const entorno = process.env.NODE_ENV;

export const sendMail = async function(email = '', subject = '', plantilla = '', body = {}) {
    let readHTMLFile = function(path, callback) {
        fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
            if (err) {
                throw err;
                callback(err);
            } else {
                callback(null, html);
            }
        });
    };
    let transporter = {} || ''
    if (entorno === 'dev') {
        transporter = nodemailer.createTransport(smtpTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: user,
                pass: pass
            }
        }));
    }

    if (entorno === 'production') {
        transporter = nodemailer.createTransport(smtpTransport({
            // service: 'hotmail',
            host: "mail.fabriziodev.ar",
            port: 465,
            secure: true,
            auth: {
                user: user,
                pass: pass
            },
            tls: {
                rejectUnauthorized: false
            }
        }));
    }


    readHTMLFile(process.cwd() + `/src/mails/pages/${plantilla}.html`, (err, html) => {

        let rest_html = ejs.render(html, body);

        let template = Handlebars.compile(rest_html);
        let htmlToSend = template({ op: true });

        let mailOptions = {
            from: `No Reply - Fabrizio Dev <${user}>`,
            to: email, //email para quien va enviado
            subject: subject,
            html: htmlToSend
        };
        // res.status(200).send({ data: true });
        transporter.sendMail(mailOptions, function(error, info) {
            if (!error) {
                console.log(`Email enviado: ${info.response}`.bgGreen.white);
            } else {
                console.log(`${error}`.bgRed.white);
            }
        });

    });
}