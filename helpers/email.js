import nodemailer from "nodemailer"


const reestablecerPassMail = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    await transport.sendMail({
        from: 'DevJobs.com',
        to: datos.email,
        subject:'Reestablecer contraseña de DevJobs',
        html: `<h1 style="text-align:center; font-family: Arial, Helvetica;">Reestablecer contraseña</h1>
    
                <p style="font-family: Arial, Helvetica;">Hola ${datos.nombre}, has solicitado reestablecer tu contraseña, haz click en el siguiente enlace. Este enlace es temporal, si se vence es necesario que vuelvas a solicitar otro e-mail.</p>
    
                <a style="
                    display:block; 
                    font-family: Arial, Helvetica;
                    padding: 1rem; 
                    background-color: #00C897; 
                    color:white; 
                    text-transform:uppercase; 
                    text-align:center;
                    text-decoration: none;"
                href="${datos.resetUrl}">Resetear Password</a>
    
                <p style="font-family: Arial, Helvetica;">Si no puedes acceder a este enlace, visita:${datos.resetUrl}</p>
                <p style="font-family: Arial, Helvetica;">Si no solicitaste este e-mail, puedes ignorarlo</p>`

    })
}

export {
    reestablecerPassMail
}