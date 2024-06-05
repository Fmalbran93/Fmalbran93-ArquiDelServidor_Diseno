const socketClient = io();

socketClient.on("enviodeproducts", (obj) => {
  updateProductList(obj);
});

// producto creado en http://localhost:8080/realtimeproducts y actualizado en  http://localhost:8080/
function updateProductList(productList) {
  const productsDiv = document.getElementById("list-products");
  let productosHTML = "";
  productList.forEach((product) => {
    productosHTML += `<div class=" container mb-4 mx-auto card d-flex align-items-center gap-4" style="max-width: 18rem;">
        <div class="text-light text-center mt-3">codigo del producto: ${
          product.code
        } </br>ID: ${product._id}</div>
        <div class="card-body">
        <img src="${
          product.thumbnail
        }" alt="img" class="img-thumbnail img-fluid h-30">
            <ul class="card-text">
            <li><h4 class="fs-5 text-center mt-3 text-warning">${
              product.title
            }</h4></li>
            <li class="text-center mb-2 fs-5">categoria: ${
              product.category
            }</li>
            <li class="text-center mb-2 fs-5">Estado: ${product.status}</li>
            <li class="text-center mb-2 fs-5">Existencias: ${product.stock}</li>
            <li class="text-center mt-3 mb-2 fs-3 text-warning text-center mt-2">$${
              product.price
            }</li>
            <div class="d-flex justify-content-center mt-4 mb-4">
            <button type="button" class="btn btn-danger delete-btn" onclick="deleteProduct('${String(
              product._id
            )}')">Eliminar</button>
            </div>
            </ul>
        </div>
    </div>
</div>`;
  });
  productsDiv.innerHTML = productosHTML;
}

// recibir los valores del body del formulario de crear porductos
let form = document.getElementById("formProduct");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  let title = form.elements.title.value;
  let description = form.elements.description.value;
  let stock = form.elements.stock.value;
  let thumbnail = form.elements.thumbnail.value;
  let category = form.elements.category.value;
  let price = form.elements.price.value;
  let code = form.elements.code.value;
  let status = form.elements.status.checked;
  socketClient.emit("addProduct", {
    title,
    description,
    stock,
    thumbnail,
    category,
    price,
    code,
    status,
  });
  form.reset();
});

//Elimina producto seleccionado
document.getElementById("delete-btn").addEventListener("click", function () {
  const deleteidinput = document.getElementById("id-prod");
  const deleteid = deleteidinput.value;
  socketClient.emit("deleteProduct", deleteid);
  deleteidinput.value = "";
});

// elimina el producto de la vista products
function deleteProduct(productId) {
  socketClient.emit("deleteProduct", productId);
}