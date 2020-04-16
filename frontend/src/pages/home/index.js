import React,{useState, useEffect} from 'react';
import {
    Container,
    Row,
    Col,
    Button,
    Table,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Alert
} from 'reactstrap';
import api from '../../services/api';
import './style.css';

function Home(){
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [messageRegister, setMessageRegister] = useState(false);
    const [messageDelete, setMessageDelete] = useState(false);
    const [messageUpdate, setMessageUpdate] = useState(false);

    const [modalAdd, setModalAdd] = useState(false);
    const toggleAdd = () => setModalAdd(!modalAdd);

    const [modalDelete, setModalDelete] = useState(false);
    const toggleDelete = (id) => {
        localStorage.setItem('idDelete', id);

        setModalDelete(!modalDelete);
    };

    const [modalUpdate, setModalUpdate] = useState(false);
    const toggleUpdate = (product) => {
        localStorage.setItem('idUpdate', product.id);

        setName(product.name);
        setPrice(product.price);
        setAmount(product.amount);

        setModalUpdate(!modalUpdate);
    };

    useEffect(() => {
        api.get('product').then(response => {setProducts(response.data)});
    });

    async function handleRegisterProduct(e){
        e.preventDefault();

        const data = {name, price, amount};

        try{
            await api.post('product', data);
            setName('');
            setPrice('');
            setAmount('');
            toggleAdd();
            setMessageRegister(true);

            setTimeout(() => {
                setMessageRegister(false);
            }, 3000);
        }catch(err){
            alert('Erro ao cadastrar produto');
        }
    }

    async function handleDelete(){
        const id = parseInt(localStorage.getItem('idDelete'));

        try{
            await api.delete(`product/${id}`);
            setProducts(products.filter(product => product.id !== id));
            localStorage.clear();
            toggleDelete();
            setMessageDelete(true);

            setTimeout(() => {
                setMessageDelete(false);
            }, 3000);
        }catch(err){
            alert('Erro ao deletar produto');
            localStorage.clear();
        }
    }

    async function handleUpdate(e){
        e.preventDefault();

        const id = parseInt(localStorage.getItem('idUpdate'));

        try{
            await api.put(`product/${id}`, {name, amount, price});
            setName('');
            setPrice('');
            setAmount('');
            localStorage.clear();
            toggleUpdate(id);
            setMessageUpdate(true);

            setTimeout(() => {
                setMessageUpdate(false);
            }, 3000);
        }catch(err){
            alert('Erro ao atualizar produto');
            localStorage.clear();
        }
    }

    return (
        <div>
            <Container className="col-md-8">
                <Row>
                    <Col>
                        <center>
                            <h1>Gerenciador de produtos</h1>
                        </center>
                        <hr/>
                    </Col>
                </Row>
                <Row>
                    {messageRegister !== false ? (
                        <Col>
                            <center>
                                <Alert color="success">Produto cadastrado com sucesso!</Alert>
                            </center>
                        </Col>
                    ) : ('')}
                </Row>
                <Row>
                    {messageUpdate !== false ? (
                        <Col>
                            <center>
                                <Alert color="primary">Produto atualizado com sucesso!</Alert>
                            </center>
                        </Col>
                    ) : ('')}
                </Row>
                <Row>
                    {messageDelete !== false ? (
                        <Col>
                            <center>
                                <Alert color="danger">Produto deletado com sucesso!</Alert>
                            </center>
                        </Col>
                    ) : ('')}
                </Row>
                <Row>
                    <Col>
                        <Button color="primary" className="button-add-product" onClick={toggleAdd}>Cadastrar produto</Button>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col>
                        <Table className="table-striped">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Nome</th>
                                    <th>Preço</th>
                                    <th>Quantidade</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (products.map(produtc => (
                                    <tr key={produtc.id}>
                                        <th>{produtc.id}</th>
                                        <th>{produtc.name}</th>
                                        <th>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(produtc.price)}</th>
                                        <th>{produtc.amount}</th>
                                        <th>
                                            <Button color="success" className="button-actions" onClick={() => toggleUpdate(produtc)}>Editar</Button>
                                            <Button color="danger" className="button-actions" onClick={() => toggleDelete(produtc.id)}>Apagar</Button>
                                        </th>
                                    </tr>
                                ))) : (
                                    <tr>
                                        <th colSpan="5">
                                            <center>
                                                <h3 className="text-notice">Ainda não há produtos</h3>
                                            </center>
                                        </th>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
            <Modal isOpen={modalAdd} toggle={toggleAdd}>
                <ModalHeader toggle={toggleAdd}>Adicione um novo produto</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleRegisterProduct}>
                        <FormGroup>
                            <Input placeholder="Digite o nome do produto" value={name} onChange={e => setName(e.target.value)} required></Input>
                        </FormGroup>
                        <FormGroup>
                            <Input type="number" placeholder="Digite a quantidade do produto" value={amount} onChange={e => setAmount(e.target.value)} required></Input>
                        </FormGroup>
                        <FormGroup>
                            <Input type="number" placeholder="Digite o preço do produto" value={price} onChange={e => setPrice(e.target.value)} required></Input>
                        </FormGroup>
                        <ModalFooter>
                            <FormGroup>
                                <Button type="submit" color="primary" className="button-actions">Cadastrar</Button>
                                <Button color="secondary" className="button-actions" onClick={toggleAdd}>Cancelar</Button>
                            </FormGroup>
                        </ModalFooter>
                    </Form>
                </ModalBody>
            </Modal>
            <Modal isOpen={modalDelete} toggle={toggleDelete}>
                <ModalHeader toggle={toggleDelete}>Remover um produto</ModalHeader>
                <ModalBody>
                    <Form>
                        Deseja realmente deletar este produto?
                        </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleDelete}>Deletar</Button>
                    <Button color="secondary" onClick={toggleDelete}>Cancelar</Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={modalUpdate} toggle={toggleUpdate}>
                <ModalHeader toggle={toggleUpdate}>Edição de um produto</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleUpdate}>
                        <FormGroup>
                            <Input placeholder="Digite o nome do produto" value={name} onChange={e => setName(e.target.value)} required></Input>
                        </FormGroup>
                        <FormGroup>
                            <Input type="number" placeholder="Digite a quantidade do produto" value={amount} onChange={e => setAmount(e.target.value)} required></Input>
                        </FormGroup>
                        <FormGroup>
                            <Input type="number" placeholder="Digite o preço do produto" value={price} onChange={e => setPrice(e.target.value)} required></Input>
                        </FormGroup>
                        <FormGroup>
                            <Button type="submit" color="primary" className="button-add-product">Atualizar</Button>
                        </FormGroup>
                        <FormGroup>
                            <Button color="secondary" onClick={toggleUpdate} className="button-add-product">Cancelar</Button>
                        </FormGroup>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    );
}

export default Home;