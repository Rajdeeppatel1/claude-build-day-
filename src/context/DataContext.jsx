import { createContext, useContext, useState, useCallback } from 'react';
import { generateId } from '../utils/helpers';

const DataContext = createContext(null);

function readDonations() {
  return JSON.parse(localStorage.getItem('annasetu_donations') || '[]');
}
function writeDonations(data) {
  localStorage.setItem('annasetu_donations', JSON.stringify(data));
}
function readUsers() {
  return JSON.parse(localStorage.getItem('annasetu_users') || '[]');
}
function writeUsers(data) {
  localStorage.setItem('annasetu_users', JSON.stringify(data));
}

export function DataProvider({ children }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const getDonations = useCallback(() => readDonations(), [refreshKey]);

  const getDonationById = useCallback(
    (id) => readDonations().find((d) => d.id === id),
    [refreshKey]
  );

  const getDonationsByDonor = useCallback(
    (donorId) => readDonations().filter((d) => d.donorId === donorId),
    [refreshKey]
  );

  const getDonationsByNGO = useCallback(
    (ngoId) => readDonations().filter((d) => d.ngoId === ngoId),
    [refreshKey]
  );

  const getAvailableDonations = useCallback(
    () => readDonations().filter((d) => d.status === 'pending'),
    [refreshKey]
  );

  const createDonation = useCallback(
    (donationData) => {
      const donations = readDonations();
      const newDonation = {
        ...donationData,
        id: generateId('don'),
        status: 'pending',
        ngoId: null,
        ngoName: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      donations.unshift(newDonation);
      writeDonations(donations);

      // Create notifications for NGOs in the area
      const users = readUsers();
      const ngos = users.filter((u) => u.role === 'ngo' && u.verified);
      const notifications = JSON.parse(
        localStorage.getItem('annasetu_notifications') || '[]'
      );
      ngos.forEach((ngo) => {
        notifications.unshift({
          id: generateId('notif'),
          userId: ngo.id,
          type: 'new_donation',
          title: 'New Donation Available!',
          message: `${donationData.donorName} has posted ${donationData.quantity} of ${donationData.foodType} at ${donationData.area}.`,
          donationId: newDonation.id,
          read: false,
          createdAt: new Date().toISOString(),
        });
      });
      localStorage.setItem(
        'annasetu_notifications',
        JSON.stringify(notifications)
      );
      refresh();
      return newDonation;
    },
    [refresh]
  );

  const updateDonationStatus = useCallback(
    (donationId, status, ngoId = null, ngoName = null) => {
      const donations = readDonations();
      const idx = donations.findIndex((d) => d.id === donationId);
      if (idx !== -1) {
        donations[idx] = {
          ...donations[idx],
          status,
          updatedAt: new Date().toISOString(),
          ...(ngoId && { ngoId, ngoName }),
        };
        writeDonations(donations);

        // Create notification for donor
        const donation = donations[idx];
        const notifications = JSON.parse(
          localStorage.getItem('annasetu_notifications') || '[]'
        );

        const statusMessages = {
          accepted: `${ngoName || donation.ngoName} accepted your ${donation.foodType} donation.`,
          pickup_scheduled: `Pickup has been scheduled for your ${donation.foodType} donation.`,
          collected: `Your ${donation.foodType} donation has been collected by ${donation.ngoName}.`,
          delivered: `Your ${donation.foodType} donation has been successfully delivered!`,
          rejected: `Your ${donation.foodType} donation was not accepted. Consider reposting.`,
        };

        const statusTitles = {
          accepted: 'Donation Accepted!',
          pickup_scheduled: 'Pickup Scheduled',
          collected: 'Food Collected',
          delivered: 'Donation Delivered! 🎉',
          rejected: 'Donation Update',
        };

        if (statusMessages[status]) {
          notifications.unshift({
            id: generateId('notif'),
            userId: donation.donorId,
            type: `donation_${status}`,
            title: statusTitles[status],
            message: statusMessages[status],
            donationId: donation.id,
            read: false,
            createdAt: new Date().toISOString(),
          });
          localStorage.setItem(
            'annasetu_notifications',
            JSON.stringify(notifications)
          );
        }
        refresh();
      }
    },
    [refresh]
  );

  const getUsers = useCallback(() => readUsers(), [refreshKey]);

  const getUsersByRole = useCallback(
    (role) => readUsers().filter((u) => u.role === role),
    [refreshKey]
  );

  const verifyUser = useCallback(
    (userId) => {
      const users = readUsers();
      const idx = users.findIndex((u) => u.id === userId);
      if (idx !== -1) {
        users[idx].verified = true;
        writeUsers(users);
        refresh();
      }
    },
    [refresh]
  );

  const deleteUser = useCallback(
    (userId) => {
      let users = readUsers();
      users = users.filter((u) => u.id !== userId);
      writeUsers(users);
      refresh();
    },
    [refresh]
  );

  return (
    <DataContext.Provider
      value={{
        getDonations,
        getDonationById,
        getDonationsByDonor,
        getDonationsByNGO,
        getAvailableDonations,
        createDonation,
        updateDonationStatus,
        getUsers,
        getUsersByRole,
        verifyUser,
        deleteUser,
        refresh,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
