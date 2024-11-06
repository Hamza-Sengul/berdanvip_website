import express from "express";
import * as pageController from "../controller/pageControler.js";

const router = express.Router();

router.route("/").get(pageController.getIndexPage);
router.route("/about").get(pageController.getAboutPage);
router.route("/services").get(pageController.getServicesPage);
router.route("/photos").get(pageController.getPhotosPage);
router.route("/contact").get(pageController.getContactPage);
router.route("/admin").get(pageController.getAdminPage);

export default router;
