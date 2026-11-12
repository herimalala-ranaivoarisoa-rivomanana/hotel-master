import RoomDetails from '../../components/room/RoomDetails'
import Layout from '../../components/layout/Layout'

import { getRoomData, roomLoadError } from '../../services/roomQueries'
import { ROOM_DETAILS_SUCCESS, ROOM_DETAILS_FAIL } from '../../redux/constants/roomConstants'

import { wrapper } from '../../redux/store'

export default function RoomDetailsPage() {
    return (
        <Layout>
            <RoomDetails title='Room Details' />
        </Layout>
    )
}

export const getServerSideProps = wrapper.getServerSideProps((store)=>async ({ res, params }) => {
  try {
    const room = await getRoomData(params.id);
    if (!room) return { notFound: true };
    store.dispatch({ type: ROOM_DETAILS_SUCCESS, payload: JSON.parse(JSON.stringify(room)) });
  } catch (error) {
    if (error.name === 'CastError') return { notFound: true };
    res.statusCode = 503;
    store.dispatch({ type: ROOM_DETAILS_FAIL, payload: roomLoadError(error) });
  }
  return { props: {} };
})
