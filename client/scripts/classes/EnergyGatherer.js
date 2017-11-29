import { WindListenerMixin } from "./WindListenerMixin";
import { SunListenerMixin } from "./SunListenerMixin";
import { mix } from "./Mixin";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/merge';

export class EnergyGatherer extends mix(class Listeners {}).with(SunListenerMixin, WindListenerMixin){


    listenToSources() {
        this.sourcesSubscription = Observable.merge(this.getSunStream(), this.getWindStream()).subscribe(this.move.bind(this));
    }

    unsubscribeFromSources () {
        this.sourcesSubscription.unsubscribe();
    }
}