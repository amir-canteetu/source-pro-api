export const ROLES = {
  admin: {
    tasks: {
      create: true,
      read: true,
      update: true,
    },
    records: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  },
  buyer: {
    tasks: {
      create: true,
      read: true,
      update: true,
      delete: (user, task) => task.authorId === user.id,
    },
    records: {
      create: true,
      read: true,
      update: true,
      delete: (user, record) => record.authorId === user.id,
    },
  },
  user: {
    tasks: {
      create: true,
      read: (user, task) =>
        task.authorId === user.id || task.invitedUsers.includes(user.id),
      update: (user, task) => task.authorId === user.id,
      delete: (user, task) => task.authorId === user.id,
    },
    records: {
      create: true,
      read: (user, record) => !user.blockedBy.includes(record.authorId),
      update: (user, record) =>
        record.authorId === user.id || record.invitedUsers.includes(user.id),
      delete: (user, record) =>
        (record.authorId === user.id ||
          record.invitedUsers.includes(user.id)) &&
        record.completed,
    },
  },
};

// Utility function to check permissions
export const hasPermission = (user, resource, action, data) => {
  return user.roles.some((role) => {
    const permissions = ROLES[role]?.[resource]?.[action];
    if (permissions == null) {
      return false;
    }

    // If permission is a boolean, return it directly
    if (typeof permissions === "boolean") {
      return permissions;
    }
    // If permission is a function, validate data and evaluate it
    return data != null && permissions(user, data);
  });
};
