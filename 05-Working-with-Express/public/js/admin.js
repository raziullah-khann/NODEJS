// const deleteProduct = (btn) => {
//   const prodId = btn.parentNode.querySelector("[name=productId]").value;
//   const csrfToken = btn.parentNode.querySelector("[name=_csrf]").value;

//   const productElement = btn.closest("article");

//   fetch("/admin/product/" + prodId, {
//     method: "DELETE",
//     headers: {
//       "csrf-Token": csrfToken,
//     },
//   })
//     .then((result) => {
//       return result.json();
//     })
//     .then((data) => {
//       console.log(data);
//       productElement.parentNode.removeChild(productElement);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

document.querySelectorAll(".delete-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
      const productId = this.getAttribute("data-product-id");
      const csrfToken = this.getAttribute("data-csrf");

      fetch(`/admin/delete-product/${productId}`, {
          method: "DELETE",
          headers: {
              "csrf-token": csrfToken
          }
      })
      .then(res => {
          if (!res.ok) {
              throw new Error("Failed to delete product.");
          }
          return res.json();
      })
      .then(() => {
          this.closest("article").remove(); // Remove product from UI
      })
      .catch(err => console.error(err));
  });
});
