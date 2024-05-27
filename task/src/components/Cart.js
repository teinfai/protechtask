import React, { Fragment, useState } from 'react';
import { Card, CardBody, CardTitle, CardText, Button, Row, Col, Container, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UpdateCart } from "../Store/reduxjs/cart.js";
import './Cart.css';
import { toast } from 'react-toastify';



function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const products = useSelector((state) => state.cart.value);

    const [selectedItems, setSelectedItems] = useState({});
    const [selectAll, setSelectAll] = useState(false);


    const toggleCheckbox = (productId) => {
        setSelectedItems(prevState => {
            return {
                //reorganize back selected array
                ...prevState, [productId]: !prevState[productId]
            };
        });
    };

    const removeItem = (productId) => {
        notify();
        const updatedProducts = products.filter(product => product.id !== productId);
        dispatch(UpdateCart(updatedProducts));
        setSelectedItems(prevState => {
            const { [productId]: removed, ...newState } = prevState;
            return newState;
        });
    };

    const isNotExpired = (dateString) => {
        if (!dateString) return false; // Handle case where dateString is not provided
        const [day, month, year] = dateString.split("/");
        const formattedDate = `${month}/${day}/${year}`;
        const currentDate = new Date();
        const expirationDate = new Date(formattedDate);
        // const abc = true;
        if (expirationDate > currentDate) {
            return true;
        } else {
            return false;
        }

        // return abc;
        // return expirationDate > currentDate;
    };

    const removeExpiredItem = () => {
        notify();

        // Filter out expired products
        const updatedProducts = products.filter(product => isNotExpired(product.expiredDate));

        // Dispatch the updated products to the store
        dispatch(UpdateCart(updatedProducts));

        // Update the selected items to reflect only the non-expired products
        setSelectedItems(prevState => {
            const newSelectedItems = {};
            updatedProducts.forEach(product => {
                newSelectedItems[product.id] = prevState[product.id];
            });
            return newSelectedItems;
        });
    };


    const removeAllInCart = () => {
        notify();
        // console.log(updatedProducts); 
        dispatch(UpdateCart([]));

        setSelectedItems(prevState => { });
    };



    const handleSelectAll = () => {
        const newSelectedItems = {};
        products.forEach(product => {
            if (!product.expiredDate || isNotExpired(product.expiredDate)) {
                newSelectedItems[product.id] = !selectAll;
            }
        });
        setSelectedItems(newSelectedItems);
        setSelectAll(!selectAll);
    };

    const decrementQuantity = (productId) => {
        const updatedProducts = products.map(product =>
            (product.id === productId && product.quantity > 1) ? { ...product, quantity: Math.max(product.quantity - 1, 0) } : product
        );
        dispatch(UpdateCart(updatedProducts));
    };

    const incrementQuantity = (productId) => {
        const updatedProducts = products.map(product =>
            product.id === productId
                ? { ...product, quantity: product.quantity + 1 }
                : product
        );
        dispatch(UpdateCart(updatedProducts));
    };

    const gobacktoshopping = () => {
        navigate('/');
    };

    const notify = () => {
        toast.success('Remove Successful !!', {
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


    const totalSelectedPrice = products.reduce((total, product) => {
        if (selectedItems[product.id]) {
            return total + (product.price * product.quantity);
        }
        return total;
    }, 0);


    return (
        <Fragment>

            <Row className="align-items-start justify-content-center mb-1 mx-0" style={{ backgroundColor: '#70b2d9', backgroundImage: 'linear-gradient(315deg, #70b2d9 0%, #39e5b6 74%)', height: "150px" }}>
                <Col onClick={gobacktoshopping} className="text-center align-self-center pb-5" xs="3">
                    <FontAwesomeIcon icon={faSearch} onClick={gobacktoshopping} size="lg" className="search-icon" />
                </Col>
                <Col className="text-center mt-2 text-white" xs="6">
                    <h2 onClick={gobacktoshopping} className='mb-0'>购物车</h2>
                </Col>
                <Col className="text-center tex-white mt-3" xs="3">
                    <p onClick={gobacktoshopping} >选择</p>
                </Col>
            </Row>

            <div style={{ position: 'absolute', top: '50px', width: '100%', zIndex: 2 }}>
                <Row >
                    <Col xs="12">
                        {products.some(product => {
                            const [day, month, year] = product.expiredDate.split("/");
                            const formattedDate = `${month}/${day}/${year}`;
                            const currentDate = new Date();
                            const expirationDate = new Date(formattedDate);
                            return expirationDate > currentDate;
                        }) && (
                                <Row>
                                    <Row className='mt-4 justify-content-end'>
                                        <Col xs="11" className='text-end' style={{ fontWeight: '800' }}> <FontAwesomeIcon onClick={() => removeAllInCart()} icon={faTrash} /> <span onClick={() => removeAllInCart()}>清空购物车</span></Col>
                                    </Row>

                                    <Col xs="12">
                                        <Card style={{ width: '93%', margin: '1rem' }}>

                                            <CardBody>
                                                {products
                                                    .filter(product => {
                                                        const [day, month, year] = product.expiredDate.split("/");
                                                        const formattedDate = `${month}/${day}/${year}`;
                                                        const currentDate = new Date();
                                                        const expirationDate = new Date(formattedDate);
                                                        return expirationDate > currentDate;
                                                    })
                                                    .map(product => (
                                                        <div key={product.id} className='my-4'>
                                                            <Row>
                                                                <Col xs="1" className='align-self-center'>
                                                                    <Input type="checkbox" checked={selectedItems[product.id] || false} onChange={() => toggleCheckbox(product.id)} />
                                                                </Col>
                                                                <Col className='align-self-center' xs="4">
                                                                    <img src={product.image} alt={product.name} className='img-fluid' />
                                                                </Col>
                                                                <Col xs="7">
                                                                    <Row className='mb-3'>
                                                                        <Col xs="10" className='px-0'>
                                                                            <CardTitle tag="div" style={{ fontWeight: 'bold' }}>{product.name}</CardTitle>
                                                                        </Col>
                                                                        <Col xs="1">
                                                                            <FontAwesomeIcon className="pe-3" onClick={() => removeItem(product.id)} icon={faTrash} />
                                                                        </Col>

                                                                    </Row>

                                                                    <Row>
                                                                        <Col xs="5" className='px-0'>
                                                                            <CardText style={{ color: 'red', fontWeight: '600' }}>Price: ¥{product.quantity * product.price}</CardText>
                                                                        </Col>
                                                                        <Col className='text-center px-0' xs="7">

                                                                            <Button color="primary" onClick={() => decrementQuantity(product.id)} style={{ backgroundColor: 'transparent', color: 'grey', border: '1px solid grey', width: '50px', padding: '1px' }}>-</Button>{' '}
                                                                            <span className='mx-1'>{product.quantity}{' '}</span>
                                                                            <Button color="primary" onClick={() => incrementQuantity(product.id)} style={{ backgroundColor: 'transparent', color: 'grey', border: '1px solid grey', width: '50px', padding: '1px' }}>+</Button>{' '}
                                                                        </Col>
                                                                    </Row>

                                                                </Col>
                                                            </Row>
                                                            <br />
                                                        </div>
                                                    ))}
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            )}

                    </Col>
                </Row>
                <Row className='mb-5'>
                    <Col xs="12" className='mb-5'>
                        {products.some(product => {
                            const [day, month, year] = product.expiredDate.split("/");
                            const formattedDate = `${month}/${day}/${year}`;
                            const currentDate = new Date();
                            const expirationDate = new Date(formattedDate);
                            return expirationDate < currentDate;
                        }) && (
                                <Card style={{ width: '93%', margin: '1rem' }}>
                                    <Row className='mt-3 sticky-bottom'>
                                        <Col style={{ fontWeight: '800' }} className='text-center' xs="4">已失效</Col>
                                        <Col xs="4" style={{ color: 'red', fontWeight: '800' }}>移入收藏夹</Col>
                                        <Col onClick={() => removeExpiredItem()} xs="4" style={{ color: 'red', fontWeight: '800' }}>清空失效的宝贝</Col>
                                    </Row>
                                    <CardBody className="">
                                        {products
                                            .filter(product => {
                                                const [day, month, year] = product.expiredDate.split("/");
                                                const formattedDate = `${month}/${day}/${year}`;
                                                const currentDate = new Date();
                                                const expirationDate = new Date(formattedDate);
                                                return expirationDate < currentDate;
                                            })
                                            .map(product => (
                                                <div key={product.id}>
                                                    <Row >
                                                        <Col xs="1" className='align-self-center'>
                                                            {/* <Input type="checkbox" checked={selectedItems[product.id] || false} onChange={() => toggleCheckbox(product.id)} /> */}
                                                        </Col>
                                                        <Col className='align-self-center' xs="4">
                                                            <img src={product.image} alt={product.name} className='img-fluid' />
                                                        </Col>
                                                        <Col xs="7">
                                                            <Row className='mb-3'>
                                                                <Col xs="10" className='px-0'>
                                                                    <CardTitle tag="div" style={{ fontWeight: 'bold' }}>{product.name}</CardTitle>
                                                                </Col>
                                                                <Col xs="1">
                                                                    {/* <FontAwesomeIcon className="pe-3" onClick={() => removeItem(product.id)} icon={faTrash} /> */}
                                                                </Col>

                                                            </Row>

                                                            <Row>
                                                                <Col xs="5" className='px-0'>
                                                                    <CardText style={{ color: 'red', fontWeight: '600' }}>Price: ¥{product.quantity * product.price}</CardText>
                                                                </Col>
                                                                <Col className='text-center px-0' xs="7">

                                                                    <Button color="primary" disabled="true" onClick={() => decrementQuantity(product.id)} style={{ backgroundColor: 'transparent', color: 'grey', border: '1px solid grey', width: '50px', padding: '1px' }}>-</Button>{' '}
                                                                    <span className='mx-1'>{product.quantity}{' '}</span>
                                                                    <Button color="primary" disabled="true" onClick={() => incrementQuantity(product.id)} style={{ backgroundColor: 'transparent', color: 'grey', border: '1px solid grey', width: '50px', padding: '1px' }}>+</Button>{' '}
                                                                </Col>
                                                            </Row>

                                                        </Col>
                                                    </Row>
                                                    <br />
                                                </div>
                                            ))}
                                    </CardBody>
                                </Card>
                            )}

                    </Col>
                </Row>
            </div>

            <Row className="fixed-bottom align-items-center justify-content-between p-3" style={{ backgroundColor: '#f8f9fa' }}>
                <Col xs="auto" className='text-start'>
                    <Input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                    <span className="ms-2">全选</span>
                </Col>
                <Col xs="auto" className="text-end">
                    合计： ¥{totalSelectedPrice !== 0 ? totalSelectedPrice : "0.00"}
                </Col>

                <Col xs="auto" className="text-center">
                    <Button color="primary" style={{ borderRadius: '30px', backgroundColor: '#ADD8E6', borderColor: '#ADD8E6' }}>结算</Button>
                </Col>
            </Row>

            {/* <Container>
                <Row>
                    <Col xs="12" className="text-end">
                        <Input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                        <label> Select All</label>
                    </Col>
                </Row>
                <div className="row">
                    {products.map(product => (
                        <Row key={product.id}>
                            <Col xs="12">
                                <Card style={{ width: '100%', margin: '1rem' }}>
                                    <CardBody>
                                        <Row>
                                            <Col xs="1">
                                                <Input type="checkbox" checked={selectedItems[product.id] || false} onChange={() => toggleCheckbox(product.id)} />
                                            </Col>
                                            <Col xs="3">
                                                <img src={product.image} alt={product.name} className='img-fluid' />
                                            </Col>
                                            <Col xs="8">
                                                <CardTitle tag="h5">{product.name}</CardTitle>
                                                <CardText>Price: ${product.quantity * product.price}</CardText>
                                                <Button color="primary" onClick={() => decrementQuantity(product.id)}>-</Button>{' '}
                                                {product.quantity}{' '}
                                                <Button color="primary" onClick={() => incrementQuantity(product.id)}>+</Button>{' '}
                                                <Button color="danger" onClick={() => removeItem(product.id)}>Remove <FontAwesomeIcon icon={faTrash} /></Button>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    ))}
                </div>
                <Row>
                    <Col xs="12" className="text-end">
                        <h3>Total Price: ¥{totalSelectedPrice}</h3>
                    </Col>
                </Row>
            </Container> */}
        </Fragment >
    );
}

export default Cart;
