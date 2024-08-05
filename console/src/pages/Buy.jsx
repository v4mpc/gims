import { API_ROUTES } from "../utils.jsx";
import GenericBuy from "../components/GenericBuy.jsx";

export default function Buy() {
  return (
    <GenericBuy
      urlPath={`${API_ROUTES.stockOnhandAll}?nonZeroSoh=false`}
      isSale={false}
      queryKey="buy"
    />
  );
}
