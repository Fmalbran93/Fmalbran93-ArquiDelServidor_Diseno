import { Router } from "express";


const cookieRouter = Router();

cookieRouter.get("/set-cookie", (req, res) => {
  res.cookie(SECRETCOOKIE, "ingresaste").send("ingreso exitoso");
});

cookieRouter.get("/get-cookie", (req, res) => {
  res.send(req.cookies);
});

cookieRouter.get("/delete-cookie", (req, res) => {
  res.clearCookie(SECRETCOOKIE).send("cookie eliminada");
});

cookieRouter.get("/firm-cookie", (req, res) => {
  res
    .cookie("FirmCookie", "Mensaje secreto", { signed: true })
    .send("Cookie firmada enviada");
});

cookieRouter.get("/recovery-cookie", (req, res) => {
  const cookieValue = req.signedCookies.FirmCookie;
  if (cookieValue) {
    res.send("Cookie recuperada" + cookieValue);
  } else {
    res.send("Cookie invalida");
  }
});

export default cookieRouter;