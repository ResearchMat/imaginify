import base64

# Your vtoken
vtoken = "M4vfz4FnC3lUbU72J3EJnANEBjzaFRx7qbtOVHc0MB8/IWZ3k/k/4BdYCsb/rbUzeDGc3CVin+oawaYyz4CeXwxNDvD2l8KkarTnUMF5QiEZlNWuAhJNv206F+OTClrhvji45GG85I8BU6Ff2KTJfP4CPrUMJDxkWXT/O9CGQ1M="

# Decode the Base64 string
decoded_vtoken = base64.b64decode(vtoken)

print(decoded_vtoken)