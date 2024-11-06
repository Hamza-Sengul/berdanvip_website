let openIcon = document.querySelector("#menu-icon");
let closeIcon = document.querySelector("#close-icon");
let contactButton = document.querySelectorAll("#contact-button");

openIcon.addEventListener("click", open2);
closeIcon.addEventListener("click", close);

contactButton.forEach((button) => {
  button.addEventListener("click", contact);
});

function contact() {
  const phoneNumber = "905468708875"; // Telefon numaran (ülke koduyla)
  const message = "Merhaba, sizinle iletişime geçmek istiyorum."; // Opsiyonel mesaj
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  // WhatsApp linkine yönlendirme
  window.open(whatsappUrl, "_blank");
}
function open2() {
  document.querySelector(".sidebar").classList.add("active");
}

function close() {
  document.querySelector(".sidebar").classList.remove("active");
}

function contact() {
  const phoneNumber = "905468708875"; // Telefon numaran (ülke koduyla)
  const message = "Merhaba, sizinle iletişime geçmek istiyorum."; // Opsiyonel mesaj
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  // WhatsApp linkine yönlendirme
  window.open(whatsappUrl, "_blank");
}

ScrollReveal().reveal(".headline1", { delay: 100 });
ScrollReveal().reveal(".headline2", { delay: 300 });
ScrollReveal().reveal(".headline3", { delay: 500 });
ScrollReveal().reveal(".headline4", { delay: 1200 });
