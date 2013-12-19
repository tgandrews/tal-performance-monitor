require 'mongo'

module Dashboard
	class App < Sinatra::Application
		get '/' do
			haml :index, :locals => {:all_stats => get_statistics_as_array} 
		end

		get '/display/:stat_name' do
			stat_name = params[:stat_name]
			filter = { "name" => stat_name }
			
			stats = get_statistics_filtered_as_array(filter)

			stats_with_date = stats.select { |s| !s["date"].nil? }
			dates = stats_with_date.map { |s| "'" + format_date(s["date"]) + "'"}.join(",")
			values = stats_with_date.map { |s| s["value"].to_s }.join(",")

			haml :display, :locals => {:stat_name => stat_name, :dates => dates, :values => values}
		end

		def get_statistics
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

		def format_date(time)
			time.strftime("%H:%M:%S %d %b %Y") 
		end
	end
end