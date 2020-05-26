require 'faraday'
require 'faraday-cookie_jar'
require 'nokogiri'
require 'yaml'
require_relative 'UnanetReports'

module Unanet

  CONFIG = YAML.load(File.read("./config/unanet.yml"))

  class FetchSummaries
    include Unanet::Reports::Columns

    VALIDATE_URL = CONFIG['urls']['validate_url']
    REPORT_URL = CONFIG['urls']['report_url']
    LOOKBACK_WEEKS = CONFIG['config']['lookback']


    def initialize(user, password)

      unless (user && password)
        raise ArgumentError.new('A user and password must be set.')
      end

      @user = user
      @password = password
      @connection = Faraday.new do |req|
        req.options.open_timeout = 30
        req.use :cookie_jar
        req.request :url_encoded # form-encode POST params
        req.adapter :net_http # make requests with Net::HTTP
      end
    end

    def get_report
      result = Report.new
      begin
        #authenticate
        @connection.post do |req|
          req.url VALIDATE_URL
          req.params = {username: @user, password: @password}
        end
        #fetch the report
        response = @connection.get do |req|
          req.url REPORT_URL
        end
        result.success = response.success?
        html = response.body
        html =~ /(<table.*?<\/table>)/m
        table = $1
        table.gsub!('&#8211;', '-')
        result.csv = table_to_csv table
      rescue => ex
        $log.error(LEX("Error occurred while fetching data from Unanet for use #{@user}", ex))
        result.error = ex
        result.success = false
      end
      return result
    end

    private

    Report = Struct.new(:success, :csv, :error)

    def table_to_csv(table)
      data = []
      doc = Nokogiri::HTML(table)
      doc.xpath('//table//tr').each do |table_row|
        row_array = []
        table_row.xpath('td').each do |cell|
          #row_array << %Q{"#{cell.text.gsub("\n", ' ').gsub('"', '\"').gsub(/(\s){2,}/m, '\1')}"}
          #https://stackoverflow.com/questions/14534522/ruby-csv-parsing-string-with-escaped-quotes/14534628
          row_array << %Q{"#{cell.text.gsub("\n", ' ').gsub('"', '""').gsub(/(\s){2,}/m, '\1')}"}
          #print '"', cell.text.gsub("\n", ' ').gsub('"', '\"').gsub(/(\s){2,}/m, '\1'), "\", "
        end
        data << row_array
        #print "\n"
      end

      data.pop
      data.pop #last two rows are from an inner table
      csv = ''
      data.each do |row|
        csv << row.join(',')
        csv << "\n"
      end
      # open('d:\temp\poop3.csv', 'w') { |f|
      #   f.puts csv
      # }
      Unanet.bucket_csv CSV.parse(csv, headers: true)
    end

  end

  module ClassMethods
    include Unanet::Reports::Columns

    def get_start_of_week(date)
      dow = date.cwday
      ret = date

      if dow > 0
        ret = (date - dow)
      end
      ret
    end

    #converts big csv report into weekly 'buckets'.
    # Hash will have an array two tuple [sunday 'start of week bucket', email address] pointing to a smaller csv
    def bucket_csv(csv)
      buckets = {}
      headers = csv.headers
      csv.by_row.each do |row|
        next if row[PERSON_EMAIL_ID].nil?
        row[PERSON_EMAIL_ID].downcase!
        person = row[PERSON_EMAIL_ID]
        #if we don't have an email we are a metadata row.  Ignore....
        date = Unanet.get_start_of_week Date.strptime(row[TIMESHEET_CELL_WORK_DATE], '%m/%d/%Y')
        buckets[[date, person]] ||= [headers]
        buckets[[date, person]] << row
      end
      buckets.inject({}) do |h, (k, v)|
        data = ''
        v.each do |row|
          line = (row.is_a?(Array) ? row.join(',') : row.to_s).chomp
          data << (line + "\n")
        end
        h[k] = CSV.parse(data, headers: true)
        h
      end
    end

  end
  extend ClassMethods
end

=begin
load('./lib/unanet/unanet.rb')
user='auser'
password='something'
include Unanet
a = FetchSummaries.new(user: user, password: password)
b = a.get_report
c = b.csv
c[c.keys.first].to_s
c[c.keys.first].by_row.first[FetchSummaries::ENTRY_DATE_HEADER]
c[c.keys.last].by_row.first[FetchSummaries::ENTRY_DATE_HEADER]
c[c.keys.last].by_row[2][FetchSummaries::ENTRY_DATE_HEADER]

c[c.keys.first].split("\n").length
c[c.keys.last].split("\n").length


c[c.keys.last].by_row.first[FetchSummaries::ENTRY_DATE_HEADER]
c[c.keys.last].by_row[2][FetchSummaries::ENTRY_DATE_HEADER]
Unanet.get_start_of_week Date.strptime(c.by_row.first[FetchSummaries::ENTRY_DATE_HEADER], '%m/%d/%Y')
Unanet.get_start_of_week Date.strptime(c.by_row[20][FetchSummaries::ENTRY_DATE_HEADER], '%m/%d/%Y')

summaries.csv[summaries.csv.keys[-2]].by_row.first

=end