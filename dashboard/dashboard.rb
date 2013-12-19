require 'mongo'

module Dashboard
	class App < Sinatra::Application
		get '/' do
			haml :index, :locals => {:all_stats => get_statistics_as_array} 
		end

		get '/display/:stat_name' do
			name = params[:stat_name]
			filter = { "name" => name }
			haml :index, :locals => {:all_stats => get_statistics_filtered_as_array(filter)}
		end

		def get_statistics
			puts 'Connecting to mongo db...'
			mongo_client = Mongo::MongoClient.new("localhost")
			mongo_db = mongo_client.db('tpm')
			return mongo_db.collection('application_stats')
		end

		def get_statistics_as_array
			get_statistics.find.to_a
		end

		def get_statistics_filtered_as_array(filter)
			get_statistics.find(filter).to_a
		end
	end
end