require 'sinatra'
require 'haml'

module Dashboard
	class App < Sinatra::Application
		get '/' do
			haml :index
		end
	end
end