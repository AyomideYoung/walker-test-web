
import React from 'react';
import './css/DashboardHome.css';
import Saimai from '../images/Simi.jpg';
import GroupDashboard from './GroupDashboard';
import GroupDashboardSkeleton from '../skeletons/GroupDashboardSkeleton';
import { Image, Row, Col, Container, Button, Card } from 'react-bootstrap';

const DashboardHome = (props) => {
    const questionManagementScreenLoader = {
        url: 'http://localhost:8080/db/group-list',
        ChildComponent: GroupDashboard,
        ChildSkeleton: GroupDashboardSkeleton
    };
    return (<Container className="viewport-height pt-5" fluid>
        <Row className="justify-content-center" >
            <Col md={9}>
                <Card body>
                    <Row className="justify-content-center">
                        <Col xs={8} sm={4} md={3}>
                            <Image src={Saimai} thumbnail />
                        </Col>
                    </Row>
                    <Row className="justify-content-center pt-3 pb-1">
                        <Col xs={8} md={7} lg={5} >
                            <h2 className="text-center">{props.nameOfUser}</h2>
                            <div className="h5 ssp-regular"><span className="h5 ssp-black">Email: </span>{props.userEmail}</div>
                            <div className="h5 ssp-regular"><span className="h5 ssp-black">Managed questions: </span>{props.numberOfManagedQuestions}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{ span: 8, offset: 2 }} md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} >
                            <hr />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{ span: 8, offset: 1 }} md={{ span: 6, offset: 2 }} lg={{ span: 4, offset: 3 }} >
                            <Button variant='link' onClick={() => { props.updateScreen(questionManagementScreenLoader) }}>
                                Manage Questions
                        </Button>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>


    </Container>)
}

export default DashboardHome;