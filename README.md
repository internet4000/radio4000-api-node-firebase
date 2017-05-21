# Radio4000 API

Public API to [Radio4000.com](https://radio4000.com).

Documentation and examples can be found here [https://github.com/Internet4000/radio4000-api-docs](https://github.com/Internet4000/radio4000-api-docs).

## How to develop

- `git clone git@github.com:internet4000/radio4000-api.git`
- `cd radio4000-api; cp .env-example .env` (and enter the real keys)
- `yarn`
- `yarn start`

## How to deploy

To deploy to staging, run `yarn deploy`.

To deploy to production, first `yarn deploy` and then `now alias` (you need access to the Internet4000 team on now.sh)

Peace
