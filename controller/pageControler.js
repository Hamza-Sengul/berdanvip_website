const getIndexPage = (req, res) => {
  res.render("index");
};
const getAboutPage = (req, res) => {
  res.render("about");
};
const getServicesPage = (req, res) => {
  res.render("services");
};
const getPhotosPage = (req, res) => {
  res.render("photos");
};
const getContactPage = (req, res) => {
  res.render("contact");
};
const getAdminPage = (req, res) => {
  res.render("admin");
};

export {
  getIndexPage,
  getAboutPage,
  getServicesPage,
  getPhotosPage,
  getContactPage,
  getAdminPage,
};
