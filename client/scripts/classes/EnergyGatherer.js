import { WindListenerMixin } from "./WindListenerMixin";
import { SunListenerMixin } from "./SunListenerMixin";
import { mix } from "./Mixin";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/merge';

export class EnergyGatherer extends mix(class Listeners {}).with(SunListenerMixin, WindListenerMixin){


    listenToSources() {
        this.sourcesSubscription = Observable.merge(this.getSunStream(), this.getWindStream()).subscribe(this.move.bind(this));
    }

    listenToSourcesEventChange() {
        this.sourcesEventChangeSubscription = Observable.merge(this.getSunEventChangeStream(), this.getWindEventChangeStream())
            .subscribe(this.energyEventChange.bind(this));
    }

    energyEventChange(powerKoef){
        //implement this in children
    }

    unsubscribeFromSources () {
        this.sourcesSubscription.unsubscribe();
    }

    unsubscribeFromSourcesEventChange () {
        this.sourcesEventChangeSubscription.unsubscribe();
    }
}