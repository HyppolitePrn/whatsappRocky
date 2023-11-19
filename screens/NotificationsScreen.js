import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserType } from '../UserContext'
import { ActivityIndicator } from 'react-native'
import FriendRequest from '../components/FriendRequest'

const NotificationsScreen = () => {
  const { userId, setUserId, authToken, setAuthToken } = useContext(UserType)
  const [isLoading, setIsLoading] = useState(false)
  const [friendRequests, setFriendRequests] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        console.log(process.env.REACT_APP_API_URL)
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/friend-requests/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )

        const data = await response.json()

        console.log(data)

        setFriendRequests(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (isLoading) {
    return (
      <ActivityIndicator style={styles.loading} size='large' color='#000000' />
    )
  }

  return (
    <View style={styles.container}>
      {friendRequests?.length > 0 && (
        <Text style={styles.friendRequestsTitle}>Your Friend Requests</Text>
      )}
      {friendRequests?.map(friendRequest => (
        <FriendRequest
          friendRequest={friendRequest}
          friendRequests={friendRequests}
          setFriendRequests={setFriendRequests}
          key={friendRequest?._id}
        />
      ))}
    </View>
  )
}

export default NotificationsScreen

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 10,
    marginHorizontal: 12,
  },
  friendRequestsTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
})