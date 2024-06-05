const products = document.getElementsByClassName("product");
const btnCartFinal = document.getElementById("cartFinal");
const modalBody = document.getElementById("modalBody");
const arrayProducts = Array.from(products);

const productsInCart = () => {
  fetch("http://localhost:8080/products/inCart")
    .then((response) => response.json())
    .then((data) => {
      if (data.cartLength > 0) {
        let products = "";
        data.productsInCart.forEach((product, index) => {
          products += `
          <div ${(key = index)} class="bg__cart-prod rounded p-2 mb-2 mt-2">
          <h6 class="d-grid text-warning text-center text-uppercase"> ${
            product.title
          }<span class="mt-2 text-warning"><h6>
          <h6>Cantidad: ${product.quantity}</h6>
          <h6>Precio: ${product.price}</h6>
          </div>
          `;
        });
        modalBody.innerHTML = products;
      } else {
        modalBody.innerHTML = `<h3 class="fs-6"> no hay productos en el carrito </h3>`;
      }
    });
};

arrayProducts.forEach((product) => {
  product.addEventListener("click", () => {
    const stock = Number(product.getAttribute("data-value"));
    Swal.fire({
      title: "Cuantas unidades deseas comprar?",
      input: "number",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Agregar al carrito",
    }).then((response) => {
      if (stock > Number(response.value) && Number(response.value) > 0) {
        Swal.fire({
          title: "Producto agregado con exito",
          icon: "success",
        });
        fetch("http://localhost:8080/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product: { _id: product.id, quantity: Number(response.value) },
          }),
        });
        productsInCart();
      } else if (Number(response.value) < 0) {
        Swal.fire({
          title: "Debes agregar una cantidad",
          icon: "warning",
        });
      } else {
        Swal.fire({
          title: "No tenemos esa cantidad no unidades",
          icon: "error",
        });
      }
    });
  });
});

btnCartFinal.addEventListener("click", () => {
  Swal.fire({
    title: "Crear Carrito",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#73be73",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirmar!",
  }).then((response) => {
    if (response.isConfirmed) {
      fetch("http://localhost:8080/products/inCart")
        .then((response) => response.json())
        .then((data) => {
          if (data.cartLength > 0) {
            fetch("http://localhost:8080/products", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ finishBuy: true }),
            })
              .then(
                Swal.fire({
                  title: "Carrito creado",
                  icon: "success",
                })
              )
              .then((modalBody.innerHTML = `<h3> Carrito vacio </h3>`));
          } else {
            Swal.fire({
              title: "Carrito de compras vacio",
              text: "Que esperas para hacer tu compra?",
              icon: "info",
            });
          }
        });
    } else {
      Swal.fire({
        title: "La compra aún no se ha realizado",
        icon: "info",
      });
    }
  });
});

productsInCart();