import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function setCompany(e, data) {
  e.preventDefault();
  localStorage.setItem("company", data);
  window.location.reload();
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function handleChange() {
  console.log(document.getElementById("search").value, "value");
  if (document.getElementById("search").value === "") {
    localStorage.setItem("search", "");
  } else {
    localStorage.setItem(
      "search",
      capitalize(document.getElementById("search").value)
    );
  }
}

function App() {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    document.title = "Leetcode";
    const loadPost = async () => {
      setLoading(true);
      if (localStorage.getItem("company") === null) {
        localStorage.setItem("company", "Amazon");
      }
      if (localStorage.getItem("search") === null) {
        localStorage.setItem("search", "");
      }
      var base = "https://curious-parka-yak.cyclic.app/api/questions/";
      var response = await axios.get(base + "companies");
      setCompanies(response["data"]);

      var company = localStorage.getItem("company");
      const res = await axios.get(base + "search/company/" + company);
      setQuestions(res["data"]);
      setLoading(false);
    };

    // Call the function
    loadPost();
  }, []);

  return (
    <div>
      <h1>{localStorage.getItem("company")}</h1>
      <div className="row">
        <div className="col-8">
          <ul className="list-group">
            {loading ? (
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Loading...
              </li>
            ) : (
              questions.map((item) => (
                <a
                  href={`https://leetcode.com/problems/${item.titleSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      {item["title"]}
                      {item["isPaidOnly"] ? (
                        <span>
                          &nbsp; &nbsp;
                          <i class="fa fa-lock" aria-hidden="true"></i>
                        </span>
                      ) : null}
                    </span>

                    <span>
                      <span class={`badge badge-pill ${item["difficulty"]}`}>
                        {item["difficulty"]}
                      </span>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span class="badge badge-primary badge-pill">
                        {item["companyTags"][0]["num_occur"]}
                      </span>
                    </span>
                  </li>
                </a>
              ))
            )}
          </ul>
        </div>
        <div className="col">
          <form class="form-inline my-2 my-lg-0" id="search-form">
            <input
              class="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              id="search"
              onSubmit={handleChange}
              onChange={handleChange}
            />
            <button class="btn btn-outline-success my-2 my-sm-0" onClick={handleChange}>
              Search
            </button>
          </form>
          <ul className="list-group">
            {loading ? (
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Loading
              </li>
            ) : (
              (localStorage.getItem("search"),
              companies
                .filter((companies) =>
                  companies.includes(localStorage.getItem("search"))
                )
                .map((item) => (
                  <li
                    className={
                      item === localStorage.getItem("company")
                        ? "list-group-item d-flex justify-content-between align-items-center active"
                        : "list-group-item d-flex justify-content-between align-items-center"
                    }
                    onClick={(e) => setCompany(e, item)}
                  >
                    {item}
                  </li>
                )))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
