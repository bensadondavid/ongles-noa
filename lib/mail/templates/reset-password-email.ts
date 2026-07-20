export function getResetPasswordEmail(url: string) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Réinitialisation de votre mot de passe</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f7f4f2;
          font-family: Arial, Helvetica, sans-serif;
          color: #2f2a27;
        "
      >
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="background-color: #f7f4f2; padding: 40px 16px;"
        >
          <tr>
            <td align="center">

              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                  max-width: 560px;
                  background-color: #ffffff;
                  border-radius: 16px;
                  overflow: hidden;
                  box-shadow: 0 8px 30px rgba(47, 42, 39, 0.08);
                "
              >

                <!-- Brand -->
                <tr>
                  <td style="padding: 36px 40px 16px; text-align: center;">
                    <div
                      style="
                        font-size: 13px;
                        letter-spacing: 3px;
                        text-transform: uppercase;
                        color: #9b8174;
                        font-weight: 600;
                      "
                    >
                      Ongles Noa
                    </div>
                  </td>
                </tr>

                <!-- Title -->
                <tr>
                  <td style="padding: 12px 40px 0; text-align: center;">
                    <h1
                      style="
                        margin: 0;
                        font-size: 26px;
                        line-height: 1.3;
                        font-weight: 600;
                        color: #2f2a27;
                      "
                    >
                      Réinitialisez votre mot de passe
                    </h1>
                  </td>
                </tr>

                <!-- Description -->
                <tr>
                  <td style="padding: 20px 40px 0; text-align: center;">
                    <p
                      style="
                        margin: 0;
                        font-size: 15px;
                        line-height: 1.7;
                        color: #6f625c;
                      "
                    >
                      Nous avons reçu une demande de réinitialisation
                      du mot de passe associé à votre compte Ongles Noa.
                      Cliquez sur le bouton ci-dessous pour choisir
                      un nouveau mot de passe.
                    </p>
                  </td>
                </tr>

                <!-- Button -->
                <tr>
                  <td align="center" style="padding: 30px 40px;">
                    <a
                      href="${url}"
                      style="
                        display: inline-block;
                        background-color: #9b8174;
                        color: #ffffff;
                        text-decoration: none;
                        font-size: 15px;
                        font-weight: 600;
                        padding: 14px 28px;
                        border-radius: 10px;
                      "
                    >
                      Réinitialiser mon mot de passe
                    </a>
                  </td>
                </tr>

                <!-- Security -->
                <tr>
                  <td style="padding: 0 40px 36px; text-align: center;">
                    <p
                      style="
                        margin: 0;
                        font-size: 13px;
                        line-height: 1.6;
                        color: #9a8f89;
                      "
                    >
                      Si vous n'êtes pas à l'origine de cette demande,
                      vous pouvez ignorer cet email en toute sécurité.
                      Votre mot de passe restera inchangé.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    style="
                      border-top: 1px solid #eee7e3;
                      padding: 22px 40px;
                      text-align: center;
                    "
                  >
                    <p
                      style="
                        margin: 0;
                        font-size: 12px;
                        color: #b0a49e;
                      "
                    >
                      © ${new Date().getFullYear()} Ongles Noa
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}