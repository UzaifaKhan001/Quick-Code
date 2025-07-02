   ```mermaid
   usecaseDiagram
     actor User
     User --> (Create Room)
     User --> (Join Room)
     User --> (Collaborative Code Editing)
     User --> (Real-Time Voice Chat)
     User --> (Change Programming Language)
     User --> (Provide Input)
     User --> (Run/Compile Code)
     User --> (View Output)
     User --> (Leave Room)

     (Create Room) ..> (Join Room) : <<include>>
     (Collaborative Code Editing) ..> (Change Programming Language) : <<include>>
     (Collaborative Code Editing) ..> (Provide Input) : <<include>>
     (Collaborative Code Editing) ..> (Run/Compile Code) : <<include>>
     (Run/Compile Code) ..> (View Output) : <<include>>

     note right of User
       No login/signup required
       Multiple users per room
       All actions are real-time and collaborative
     end note