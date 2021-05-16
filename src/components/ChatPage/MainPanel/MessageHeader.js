import { Container, Row, Col, InputGroup, FormControl, Image, Accordion, Card, Button } from "react-bootstrap";
import { FaLock } from 'react-icons/fa';
import { MdFavorite } from 'react-icons/md'
import {AiOutlineSearch} from 'react-icons/ai'



export default function MessageHeader (){
    return (
        <div style={{
            width: '100%',
            height: '170px',
            border: '1px solid #dbdbdb',
            borderRedius: '4px',
            padding:'1rem',
            marginBottom: '1rem'
        }}>
            <Container>
                <Row>
                    <Col><h2>
                    <FaLock/> ChatRoomName <MdFavorite/>
                    </h2>   
                    </Col>
                    <Col>
                    <InputGroup className="md-3">
                        <InputGroup.Text><AiOutlineSearch/></InputGroup.Text>
                        <FormControl
                            placeholder="chatroomname"
                        />
                    </InputGroup>
                    
                    </Col>
                </Row>
                <div style={{display:'flex'}}>
                    <p> 
                        <Image src=""/>{" "}username
                    </p>
                </div>
                <Row>
                    <Col>
                        <Accordion>
                            <Card>
                                <Card.Header style={{padding: '0 1ren'}}>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">Click me!</Accordion.Toggle>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>Hello!</Card.Body>
                                    </Accordion.Collapse>
                                </Card.Header>
                            </Card>
                        </Accordion>
                    </Col>
                    <Col>
                        <Accordion>
                            <Card>
                                <Card.Header style={{padding: '0 1ren'}}>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">Click me!</Accordion.Toggle>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>Hello!</Card.Body>
                                    </Accordion.Collapse>
                                </Card.Header>
                            </Card>
                        </Accordion>
                    </Col>

                </Row>
            </Container>
        </div>
    )
}