import React, { Fragment, useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, CardFooter, CardText, Button, Row, Col, Container, CardSubtitle } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import benz from '../images/benz.jpg';
import bmw from '../images/bmw.jpg';
import bye from '../images/bye.jpg';
import myvi from '../images/myvi.jpg';
import proton from '../images/proton.jpg';
import subaru from '../images/subaru.png';
import { UpdateCart } from '../Store/reduxjs/cart';
import './ShoppingPage.css';
import { toast } from 'react-toastify';

function ShoppingPage() {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.value);
    const [cartitem, setcartitem] = useState([]);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/products')
            .then(response => response.json())
            .then(data =>
                setProducts(data)
            )
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const updatedProducts = products.map(item => {
        if (item.name === 'Benz') {
            return { ...item, image: benz };
        } else if (item.name === 'BMW') {
            return { ...item, image: bmw };
        } else if (item.name === 'BYD') {
            return { ...item, image: bye };
        } else if (item.name === 'Myvi') {
            return { ...item, image: myvi };
        } else if (item.name === 'Proton') {
            return { ...item, image: proton };
        } else if (item.name === 'Subaru') {
            return { ...item, image: subaru };
        }
        return item;
    });

    products.length = 0;
    updatedProducts.forEach(item => {
        products.push(item);
    });

    // console.log(products);
    // const products = [
    //     { id: 1, name: 'Benz', price: 10, image: benz, quantity: 0, location: "杭走", expiredDate: "25/03/2024" },
    //     { id: 2, name: 'BMW', price: 20, image: bmw, quantity: 0, location: "四川", expiredDate: "27/08/2024" },
    //     { id: 3, name: 'BYD', price: 30, image: bye, quantity: 0, location: "重庆", expiredDate: "27/08/2024" },
    //     { id: 4, name: 'Myvi', price: 40, image: myvi, quantity: 0, location: "湖南", expiredDate: "27/08/2024" },
    //     { id: 5, name: 'Proton', price: 50, image: proton, quantity: 0, location: "北京", expiredDate: "27/08/2024" },
    //     { id: 6, name: 'Subaru', price: 60, image: subaru, quantity: 0, location: "广东", expiredDate: "27/08/2024" },
    // ];

    const addToCart = (ProductId) => {
        notify();
        let productInCart = cart.find(item => item.id === ProductId);
        let updatedcart = [];

        if (productInCart) {
            updatedcart = cart.map(item => item.id === ProductId ? { ...item, quantity: item.quantity + 1 } : item);
            dispatch(UpdateCart(updatedcart));
        } else {
            const addproduct = products.find(item => item.id === ProductId);
            addproduct.quantity += 1;
            dispatch(UpdateCart([...cart, addproduct]));
        }

        // console.log(cart);
    };

    const goToCart = () => {
        navigate('/cart');
    };


    const notify = () => {
        toast.success('Add Cart Successful !!', {
            // className: 'custom-toast', // Apply custom CSS class
            // bodyClassName: 'custom-toast-body', // Apply additional styles to the body
            position: "top-right", // Ensure position is set to top-right
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        // toast.error('This is an error message!');
        // toast.info('This is an info message!');
        // toast.warning('This is a warning message!');
    };

    return (

        <Fragment>
            <Row className="align-items-center py-3 justify-content-center mb-1" style={{ backgroundColor: "#FFB366" }}>
                <Col className="text-start" xs="3">
                </Col>
                <Col className="text-center" xs="6">
                    <div className='fw-bold'>网购页</div>
                </Col>
                <Col className="text-center" xs="3">
                    <FontAwesomeIcon onClick={goToCart} icon={faShoppingCart} size="sm" className="cart-icon" />
                </Col>
            </Row>
            <Container>


                <Row>
                    {products.map(product => (
                        <Col xs="6" md="6" lg="4" key={product.id} className="mb-4">

                            <Card className='product-card' onClick={() => addToCart(product.id)} style={{ height: '100%' }}>
                                <CardBody className='d-flex align-items-xs-center'>
                                    <img src={product.image} alt={product.name} className="img-fluid" />
                                </CardBody>
                                <CardFooter>
                                    <CardTitle style={{ marginBottom: "40px" }} tag="h5">
                                        {product.name}
                                    </CardTitle>
                                    {/* <CardSubtitle
                                    className="mb-2 text-muted"
                                    tag="h6"
                                    >
                                    Card subtitle
                                </CardSubtitle> */}
                                    <CardText>
                                        <Row>
                                            <Col xs="6">
                                                <CardText style={{ color: 'red', fontWeight: '600' }} >¥{product.price}</CardText>
                                            </Col>
                                            <Col className="text-end" xs="6">
                                                <CardText>{product.location}</CardText>
                                            </Col>

                                        </Row>
                                    </CardText>
                                </CardFooter>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </Fragment>

    );
}

export default ShoppingPage;
