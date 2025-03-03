import { useAuth0 } from '@auth0/auth0-react';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Select } from '../formComponents/Select';

type Props = {
  setUserLocation?: React.Dispatch<React.SetStateAction<string>>,
}
const UserDataCompleter = ({ setUserLocation }: Props) => {
  const [currentUser, setCurrentUser] = useState<{ user: null | object }>({ user: null });
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const server = import.meta.env.VITE_SERVER_URL;
  const { user, getAccessTokenSilently } = useAuth0();
  const userId = user?.sub

  useEffect(() => {
    const fetchPosts = async () => {
      const token = await getAccessTokenSilently();
      try {
        const response = await fetch(`${server}/api/users/${user?.sub}`, {
          method: 'GET',
          headers: {
            authorization: Bearer ${token}
          }
        })
        const data = await response.json()
        setCurrentUser(data)
        setIsLoading(false)
        setUserLocation && setUserLocation(data.user.location)
      } catch (error) {
        console.error(error)
      }
    }
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [server, user?.sub])

  const locationOptions = [
    { value: '', label: '-Select location-' },
    { value: 'Brightest HQ', label: 'Brightest HQ (Kontich)' },
    { value: 'Brightest West', label: 'Brightest West (Gent)' },
    { value: 'Brightest East', label: 'Brightest East (Genk)' },
  ]

  const formik = useFormik({
    initialValues: {
      user_id: userId,
      location: '',
    },
    validationSchema: Yup.object({
      location: Yup.string()
        .required('This field is required'),
    }),

    onSubmit: async (values) => {
      const token = await getAccessTokenSilently();
      
      await fetch(${import.meta.env.VITE_SERVER_URL}/api/users, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: Bearer ${token}
        },
        body: JSON.stringify({
          "_id": userId,
          "location": values.location,
          "picture": user?.picture,
          "name": user?.name,
        })
      })
      window.location.reload()
    }
  })

  if (isLoading) {
    return null
  } else {
    if (currentUser.user === null) {
      return (
        <div className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center box-border bg-black/50">
          <div className="bg-white w-full max-w-xl h-fit overflow-hidden rounded">
            <div className="bg-yellow relative py-4" >
              <div className="grow px-4 flex justify-center">
                <h2 className="text-h3Mob leading-h3Mob sm:text-h3Desk sm:leading-h3Desk font-brightestDemiBold text-black">First login</h2>
              </div>
            </div>

            <div className="p-4 sm:px-10">
              <p>Welcome! Please finish your profile by adding your location.</p>
              <form onSubmit={formik.handleSubmit} className="flex flex-col justify-center items-center">
                <div className="w-2/3 sm:w-1/2 pt-4">
                  <Select
                    noLabel={true}
                    value={formik.values.location}
                    id="location"
                    name="location"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    options={locationOptions}
                  />
                  {formik.errors.location && formik.touched.location ? (<div className="text-red-500">{formik.errors.location}</div>) : null}
                </div>
                <div className="flex justify-center">
                  <button type="submit" text="Submit" />
                </div>
              </form>
            </div>
          </div>
        </div >
      )
    } else {
      return (
        null
      )
    }
  }
}

export default UserDataCompleter