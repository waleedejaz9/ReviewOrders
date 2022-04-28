import { axios } from "../../node_modules/axios/dist/axios.js";

/** @function sendReviews
 * {body} - object
 * this function sends the review form data to endpoint {reviewOrders}
 */

function sendReviews(body) {
  var config = {
    method: "post",
    url: "http://localhost:3000/reviewOrders",
    headers: {},
    data: body,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}
