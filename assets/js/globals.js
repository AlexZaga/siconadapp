const API_BASE_URL = "https://ahjende-microservice-server.onrender.com/api/v1/stage"
const API_PAYMENT_BASE_URL = "https://modulocaja-production.up.railway.app/v1/api/modulo_caja"
const API_PATHS = {
    "login": "/system/login",
    "logout": "/system/logout",
    "news": "/comunicados/all",
    "plans": "/planes/fetch",
    "subjects": "/asignaturas/plan/",
    "payments": "/pagos/get_pagos_alumno/",
    "acc_status": "/indicadores_cajas/get_estado_cuenta_alumno",
    "abono": "/abonos/add_abono/"
}

const background_image = "https://res.cloudinary.com/interprocsysmex/image/upload/v1673644266/ahjende/ofertaeducativa/ofedu-img8_dqbsre.jpg"
const ende_image = "https://res.cloudinary.com/interprocsysmex/image/upload/v1674512758/ahjende/landpage/Logo_Sin_Texto_sdcvcf.png"
const user_male_image = "https://res.cloudinary.com/interprocsysmex/image/upload/v1693835210/ahjende/siconad/avatares/male-avatar_vecnhd.png"
const user_fem_image = "https://res.cloudinary.com/interprocsysmex/image/upload/v1693835211/ahjende/siconad/avatares/female-avatar_c5bgmw.png"
const background_splash = 'https://res.cloudinary.com/interprocsysmex/image/upload/v1673676986/ahjende/blognoticias/Blog-Noticias-img_noTexto_zjqkzb.png'
const splash_image = 'https://res.cloudinary.com/interprocsysmex/image/upload/v1674512758/ahjende/landpage/Logo_Sin_Texto_sdcvcf.png'
const usr_token = "0x256399ffeeffd987eb8e6f67c26c196b8b8e84f7f3d10e31751376b3fcd9f0f2"
const payment_token = "0x8a8c3df1d90186152098843781715766bc86c6a0fac05606281408dedb306e1d"

export { 
    API_BASE_URL, API_PATHS, API_PAYMENT_BASE_URL,
    background_image, ende_image, 
    user_male_image, user_fem_image, 
    background_splash, splash_image,
    usr_token, payment_token
};