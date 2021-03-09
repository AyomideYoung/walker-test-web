import {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/TechnoTab.css';
import Container from 'react-bootstrap/Container';

const TechnoTab = (props) => {
    
    let [activeId, setActiveId] = useState((props.activeId) ? props.activeId : props.tabs[0].id);
   
    const show = (tab) => {
        setActiveId(tab.id);
    }
    
    return <div>
        <div className="d-flex flex-row border-color__techno-tab-green align-items-center ssp-regular">
            <div className="activeTab pl-3 pr-5">
                {props.tabs.filter(e => e.id === activeId)[0].name}
            </div>
            {
                 props.tabs.filter(e => e.id !== activeId)
                     .map((tab, i) => <div key={i} onClick={() =>show(tab)} className="swell click-pointer">
                            {tab.name}
                          </div>)
            }
        </div>
        <div>
            {props.tabs.map((tab, i) => <Container key={i} className={(tab.id === activeId) ? '' : 'hidden'} fluid>
                                    <tab.contentComponent {...tab.props}/>
                                </Container>)}
        </div>
    </div>
}

export default TechnoTab;