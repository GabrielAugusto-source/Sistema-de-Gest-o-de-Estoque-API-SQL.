document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const productTableBody = document.querySelector('#product-table tbody');

    async function loadProducts() {
        try {
            const response = await fetch('/products/');
            const products = await response.json();
            productTableBody.innerHTML = '';
            
            products.forEach(prod => {
                const row = `
                    <tr>
                        <td>${prod.id}</td>
                        <td>${prod.name}</td>
                        <td>${prod.quantity}</td>
                        <td>R$ ${prod.price.toFixed(2)}</td>
                        <td>
                            <button class="btn-delete" onclick="deleteProduct(${prod.id})">Excluir</button>
                        </td>
                    </tr>
                `;
                productTableBody.innerHTML += row;
            });
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
        }
    }


    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            name: document.getElementById('name').value,
            quantity: parseInt(document.getElementById('quantity').value),
            price: parseFloat(document.getElementById('price').value),
            category_id: parseInt(document.getElementById('category_id').value),
            supplier_id: parseInt(document.getElementById('supplier_id').value),
        };

        try {
            const response = await fetch('/products/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Produto cadastrado com sucesso no estoque!',
                    icon: 'success',
                    confirmButtonColor: '#27ae60'
                });
                productForm.reset();
                loadProducts();
            } else {
                Swal.fire({
                    title: 'Erro!',
                    text: 'Verifique se os IDs de Categoria e Fornecedor existem.',
                    icon: 'error',
                    confirmButtonColor: '#e74c3c'
                });
            }
        } catch (error) {
            console.error("Erro ao cadastrar produto:", error);
        }
    });


    window.deleteProduct = async (id) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Este produto será removido permanentemente!",
            icon: 'attention',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/products/${id}`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        Swal.fire(
                            'Deletado!',
                            'O produto foi removido do estoque.',
                            'success'
                        );
                        loadProducts();
                    }
                } catch (error) {
                    console.error("Erro ao deletar:", error);
                }
            }
        });
    };

    loadProducts();
});
