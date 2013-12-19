require 'mongo'

module Dashboard
	class App < Sinatra::Application
		get '/' do
			@stats = connect_to_mongo_stats
			all_stats = @stats.find.to_a
			haml :index, :locals => {:all_stats => all_stats} 
		end

		def connect_to_mongo_stats
			puts 'Connecting to mongo db...'
			mongo_client = Mongo::MongoClient.new("localhost")
			@mongo_db = mongo_client.db('tpm')
			return @mongo_db.collection('application_stats')
		end
	end
end