require 'sinatra'
require 'coffee-script'

post '/' do
  puts "PARAMS: #{params}"
  compiled = CoffeeScript.compile(params[:content])
  puts "compiled: #{compiled}"
  compiled
end