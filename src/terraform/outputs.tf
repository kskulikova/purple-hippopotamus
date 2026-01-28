output "droplet_ip" {
  value = digitalocean_droplet.docker_server.ipv4_address
}
