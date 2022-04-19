import React, { useState, useEffect } from 'react';
import {  useMutation, useLazyQuery } from 'react-apollo';
import UPDATE_CART from '../graphql/updateCart.graphql';
import GET_PRODUCT from '../graphql/getProductBySku.graphql';

const QuickOrder = () => {
    const [inputText, setInputText] = useState('');
    const [search, setSearch] = useState('');

    const [ getProductData, { data: product } ] = useLazyQuery(GET_PRODUCT);
    const [addToCart] = useMutation(UPDATE_CART);

    const handleChange = (e: any) => {
        setInputText(e.target.value);
        console.log("input changed", inputText);
    }

    useEffect(() => {
        console.log("EL resultado de mi producto es", product, search);
        if(!product) {
            alert("No se encontro el producto, ingrese algo real");
        }else{
            const { productId } = product.product;
            let skuId = parseInt(productId);
            console.log("mis datos necesarios", skuId, productId);
            addToCart({
                variables: {
                    salesChannel: "1",
                    items: [
                        {
                            id: skuId,
                            quantity: 1,
                            seller: "1" 
                        }
                    ]
                }
            })
            .then(() => {
                window.location.href = "/checkout";
            })
        }
    }, [product, search])

    const addProductToCart = () => {
        //ingresar la declaración de la mutacion
        getProductData({ variables: { sku: inputText } });
    }

    const searchProduct = (e: any) => {
        e.preventDefault();
        if(!inputText) {
            alert("por favor ingrese algo")
        }else {
            console.log("al final estamos buscando", inputText);
            setSearch(inputText);
            addProductToCart()
            //buscaremos data del producto
        }
    }
    return (
        <div>
            <h2>Compra rápida de VTEX IO</h2>
            <form onSubmit={searchProduct}>
                <div>
                    <label htmlFor='sku'>Ingresa el numero del SKU</label>
                    <input type='text' id='sku' onChange={handleChange}/>
                </div>
                <input type="submit" value="AÑADIR AL CARRITO" />
            </form>
        </div>
    )
}

export default QuickOrder;