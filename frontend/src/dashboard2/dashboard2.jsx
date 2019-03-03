import React, { Component } from 'react'
import axios from 'axios'
import Content from '../common/template/content'
import ContentHeader from '../common/template/contentHeader'
import ValueBox from '../common/widget/valueBox'
import Row from '../common/layout/row'

const BASE_URL = 'http://localhost:3003/api'


//Versão sem Redux não é necessário redux para um componente que não precisa compartilhar estado
//A versão 1 foi apenas para aprendizado
export default class Dashboard2 extends Component {

    constructor(props) {
        super(props)
        this.state = { credit: 0, debt: 0 }
    }


    componentWillMount() {
        axios.get(`${BASE_URL}/billingCycles/summary`)
            .then(resp => this.setState(resp.data))
    }

    render() {
        const { credit, debt } = this.state
        return (
            <div>
                <ContentHeader title='Dashboard' small='Versão 1.0' />
                <Content>
                    <Row>
                        <ValueBox cols='12 4' color='green' icon='bank' value={`R$ ${credit}`} text='Total de Créditos' />
                        <ValueBox cols='12 4' color='red' icon='credit-card' value={`R$ ${debt}`} text='Total de Débitos' />
                        <ValueBox cols='12 4' color='blue' icon='money' value={`R$ ${credit - debt}`} text='Valor Consolidado' />
                    </Row>
                </Content>
            </div>
        )
    }
}