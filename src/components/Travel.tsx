import TravelMap from './TravelMap';
import { travelStops } from '../travel';

export default function Travel() {
  return (
    <section id="travel" className="travel-section fade-in" aria-labelledby="travel-heading">
      <h2 id="travel-heading">Travel</h2>
      <TravelMap stops={travelStops} />
    </section>
  );
}
