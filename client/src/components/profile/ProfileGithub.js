import React, { Component } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

class ProfileGithub extends Component {
  state = {
    clientId: '20db24bd8d7bd006f9bd',
    clientSecret: '0928f0e83c526cbffc989066f1e455f3fff6d92d',
    count: 5,
    sort: 'created: asc',
    repos: []
  };

  async componentDidMount() {
    const { username } = this.props;
    const { clientId, clientSecret, count, sort } = this.state;

    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`
    );

    this.setState({ repos: res.data });
  }

  render() {
    const { repos } = this.state;
    const repoItems = repos.map(repo => (
      <div className="card card-body mb-2" key={repo.id}>
        <div className="row">
          <div className="col-md-6">
            <h4>
              <Link to={repo.html_url} className="text-info" target="_blank">
                {repo.name}
              </Link>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-6">
            <span className="badge badge-info mr-1" data-star>
              Stars: {repo.stargazers_count}
            </span>
            <span className="badge badge-secondary mr-1" data-watcher>
              Watchers: {repo.watchers_count}
            </span>
            <span className="badge badge-success" data-fork>
              Forks: {repo.forks_count}
            </span>
          </div>
        </div>
      </div>
    ));

    return (
      <div>
        <hr />
        <h3 className="mb-4">Latest Github repos</h3>
        {repoItems}
      </div>
    );
  }
}

ProfileGithub.propTypes = {
  username: propTypes.string.isRequired
};

export default ProfileGithub;
