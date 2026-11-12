import Home from '../components/Home'
import Layout from '../components/layout/Layout'

import { getRoomsData, roomLoadError } from '../services/roomQueries'
import { ALL_ROOMS_SUCCESS, ALL_ROOMS_FAIL } from '../redux/constants/roomConstants'

import { wrapper } from '../redux/store'

export default function Index() {
  return (
    <Layout>
      <Home />
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store)=>async ({ res, query }) => {
  const filters = Object.fromEntries(Object.entries({
    page: query.page, location: query.location,
    guestCapacity: query.guests, category: query.category
  }).filter(([, value]) => value !== undefined));
  try {
    const data = await getRoomsData(filters);
    store.dispatch({ type: ALL_ROOMS_SUCCESS, payload: JSON.parse(JSON.stringify(data)) });
  } catch (error) {
    res.statusCode = 503;
    store.dispatch({ type: ALL_ROOMS_FAIL, payload: roomLoadError(error) });
  }
  return { props: {} };
})
