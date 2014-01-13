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

			stats_with_version = stats.select { |s| !s["appversion"].nil? }
			unique_versions = stats_with_version.uniq{ |s| s["appversion"] }
			versions = unique_versions.map { |s| "'" + s["appversion"] + "'" }.join(",")

			version_values = []
			unique_versions.each do |stat|
				version = stat["appversion"]
				stats_for_version = stats.select { |s| s["appversion"] == version }
				version_values.push(stats_for_version)
			end

			averages = []
			version_values.each do |values_for_version|
				sum = 0
				values_for_version.each do |s|
					sum = sum + s["value"].to_i
				end
				average = sum.to_f / values_for_version.size
				averages.push(average)
			end

			values = averages.join(",")

			haml :display, :locals => {:stat_name => stat_name, :versions => versions, :values => values}
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