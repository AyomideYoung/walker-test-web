import {Container, Row, Col, Button, Card} from 'react-bootstrap';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

const DashboardHomeSkeleton = (props) => 
<SkeletonTheme color="#bfbfbf" highlightColor="#c9c9c9">
    <Container className="viewport-height pt-5" fluid>
        <Row className="justify-content-center" >
            <Col md={9}>
                <Card body> 
                    <Row className="justify-content-center">
                        <Col xs={8} sm={4} md ={3}>
                            <Skeleton height={200}/>
                        </Col>
                    </Row>
                    <Row className="justify-content-center pt-3 pb-1">
                        <Col xs={8} md={7} lg={5} className="text-center">
                            <h2><Skeleton width={190}/></h2>
                            <h5 className="ssp-black"><Skeleton count={2}/></h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{span:8, offset: 2}} md={{span:6, offset: 3}} lg={{span:4, offset: 4}} >
                            <hr/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{span:8, offset: 1}} md={{span:6, offset: 2}} lg={{span:4, offset: 3}} >
                            <Skeleton width={110}/>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </Container>
</SkeletonTheme>

export default DashboardHomeSkeleton;