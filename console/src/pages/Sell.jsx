import { API_ROUTES } from "../utils.jsx";
import GenericBuy from "../components/GenericBuy.jsx";

export default function Sell() {
  return (
    <GenericBuy
      urlPath={`${API_ROUTES.stockOnhandAll}?nonZeroSoh=true`}
      isSale={true}
      queryKey="sell"
    />
  );
}
