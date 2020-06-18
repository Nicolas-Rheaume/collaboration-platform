
enum Role {
    visitor = "Visitor",
    contributor = "Contributor",
    admin = "Admin"
  }

interface User {
    username: User
    role: Role
}

export { User, Role };