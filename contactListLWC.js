import { api, LightningElement } from 'lwc';

export default class ContactListLWC extends LightningElement {
    @api contactDetail;

    /*
     * This method is to send communication to the parent component.
    */
    tileClickHandler(){
        
        const tileClicked = new CustomEvent('tileclick',{detail:this.contactDetail, bubbles:true});
        
        this.dispatchEvent(tileClicked);
    }
}