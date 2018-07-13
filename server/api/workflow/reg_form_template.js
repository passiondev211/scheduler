const regFormTemplate = `
  <div>
    <form action="/subscribe" method="post">
      <input type="hidden" name="entranceSlug" value="{ENTRANCE_SLUG}" />
      <div>
        <h2>Subscribe to our Shoppe Platform
        </h2>
        <p>Lorem ipsum...
        </p>
      </div>
      <div>
        <table>
          <tbody>
            <tr>
              <td>
                <label>Email</label>
              </td>
              <td>
                <input type="email" placeholder="Email" name="email" required="" />
              </td>
            </tr>
            <tr>
              <td>
                <label>Phone Number</label>
              </td>
              <td>
                <input type="text" placeholder="Phone Number" name="phone_number" required="" />
              </td>
            </tr>
            <tr>
              <td>
                <label>Facebook Messenger ID</label>
              </td>
              <td>
                <input type="text" placeholder="Facebook Messenger ID" name="facebook_messenger_id" required="" />
              </td>
            </tr>
            <tr>
              <td>
              </td>
              <td>
                <input type="submit" value="Subscribe" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <p>Lorem ipsum...
        </p>
      </div>
    </form>
  </div>
`;

export default regFormTemplate;
