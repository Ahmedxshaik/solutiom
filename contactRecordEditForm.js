import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ContactRecordEditForm extends LightningElement {
    @api contactRecord;
    @track isLoading = false;
    /**
     * 
     * 
     * This is the success handler which will update the parent with new values
     */
    successHandler(event){
        const contactUpdated = new CustomEvent('contactUpdated',{detail:event.detail, bubbles:true});
        this.dispatchEvent(contactUpdated);
        this.dispatchEvent(new ShowToastEvent({
            title: "SUCCESS!",
            message: "Record Has Been Updated",
           variant: "success",
        }),  
        );  
    }
    errorHandler(event){
        console.log(event);
    }
   
    

}